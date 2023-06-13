#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod dal;
mod error;
mod service;
use crate::service::{
    arrival::show_all_arrival,
    goods::{get_goods_by_supplier, show_goods},
    purchase::{delete_purchase, query_purchase, show_purchase},
    supplier::show_all_supplier,
};
use eyre::Result;
use lazy_static::lazy_static;

use sqlx::postgres::PgPool;
use sqlx::{Pool, Postgres};
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};
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
    let uri = std::env::var("DATABASE_URL").unwrap();
    let db_uri = &uri;
    init(db_uri).await?;
    tracing_subscriber::registry().with(fmt::layer()).init();

    // 调用 `log` 包的 `info!`
    log::info!("starting...");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            show_purchase,
            delete_purchase,
            show_all_arrival,
            show_goods,
            get_goods_by_supplier,
            query_purchase,
            show_all_supplier
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
