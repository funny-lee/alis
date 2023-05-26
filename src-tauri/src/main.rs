#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod dal;
mod error;
mod service;
use crate::service::{arrival::show_all_arrival, purchase::show_purchase};
use eyre::Result;
use lazy_static::lazy_static;
use sqlx::postgres::PgPool;
use sqlx::{Pool, Postgres};
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct MyPool(Option<Pool<Postgres>>);

impl MyPool {
    // 创建连接池
    async fn new(uri: &str) -> Result<Self> {
        let pool = PgPool::connect(uri).await?;
        Ok(MyPool(Some(pool)))
    }

    // 获取连接池
    fn get_pool(&self) -> &Pool<Postgres> {
        self.0.as_ref().unwrap()
    }
}

// 实现 Default trait
impl Default for MyPool {
    fn default() -> Self {
        MyPool(None)
    }
}

// 声明创建静态连接池
lazy_static! {
    static ref POOL: Arc<RwLock<MyPool>> = Arc::new(RwLock::new(Default::default()));
}

// 初始化静态连接池
async fn init(uri: &str) -> Result<()> {
    let pool = POOL.clone();
    let mut pool = pool.write().await;
    *pool = MyPool::new(uri).await?;

    Ok(())
}
#[tokio::main]
async fn main() -> Result<()> {
    let URI  = std::env::var("DATABASE_URL").unwrap();
    let db_uri = &URI;
    init(db_uri).await?;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![show_purchase, show_all_arrival])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
