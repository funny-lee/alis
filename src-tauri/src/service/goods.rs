use crate::dal::{
    goods::{Goods, GoodsManager},
    manager::Manage,
};
use chrono::{DateTime, Utc};

// use crate::error::error::Error;
#[tauri::command(async)]
pub async fn show_goods() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let goods_manager = GoodsManager::new(pool.get_pool());
    let goods = goods_manager.get_all().await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    let goods_json = serde_json::to_string(&goods).or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    println!("aaaaaaaaaaaaaaaaa{}", goods_json);
    Ok(goods_json)
}

// #[tauri::command(async)]
// pub async fn crate_goods(goods: Goods) -> Result<String, String> {
//     let pool = crate::POOL.read().await;

//     let result = GoodsManager::(pool.get_pool()).await.or_else(|reason| {
//         // println!("Error: {}", reason);
//         Err(reason.to_string())
//     })?;
//     Ok(result.to_string())
// }
