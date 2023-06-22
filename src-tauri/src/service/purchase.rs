use crate::dal::{
    manager::Manage,
    po::{Po, PoDetail, PoManager, PoShort},
};
use chrono::{DateTime, Utc};
use sqlx::Row;
use sqlx::{Pool, Postgres};
use std::vec;
use tracing::info;
// use crate::error::error::Error;
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct PoWrapper {
    purchase_id: i32,
    worker_id: i32,
    purchase_time: DateTime<Utc>,
    pay_status: String,
    po_details: Vec<PoDetail>,
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PoQueryParams {
    purchase_id: Option<i32>,
    worker_id: Option<i32>,
    start_time: Option<DateTime<Utc>>,
    end_time: Option<DateTime<Utc>>,
}
#[tauri::command(async)]
pub async fn show_purchase() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let po_manager = PoManager::new(pool.get_pool());
    let po = po_manager
        .get_all()
        .await
        .map_err(|reason| reason.to_string())?;
    let po_short = po.0;
    let po_detail = po.1;
    let mut wrappers: Vec<PoWrapper> = Vec::new();
    for short in &po_short {
        let mut wrapper = PoWrapper {
            purchase_id: short.purchase_id,
            worker_id: short.worker_id,
            purchase_time: short.purchase_time,
            pay_status: short.pay_status.clone(),
            po_details: Vec::new(),
        };
        for detail in &po_detail {
            if detail[0].purchase_id == short.purchase_id {
                wrapper.po_details = detail.clone();
            }
        }
        wrappers.push(wrapper);
    }

    let wrapper_json = serde_json::to_string(&wrappers).or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    println!("{}", wrapper_json);
    Ok(wrapper_json)
}
//create new purchase order

#[tauri::command(async)]
pub async fn delete_purchase(purchase_id: i32) -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let result = PoManager::delete(pool.get_pool(), purchase_id)
        .await
        .or_else(|reason| {
            // println!("Error: {}", reason);
            Err(reason.to_string())
        })?;
    Ok(result.to_string())
}
#[tauri::command(async)]
pub async fn new_purchase(po: Po) -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let mut tx = pool.get_pool().begin().await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    let po_short = po.po_short;
    let po_details = po.po_details;
    let po_id:i32 = sqlx::query(
        "INSERT INTO purchase (worker_id, purchase_time, pay_status) VALUES ($1, $2, $3) RETURNING purchase_id",
    )
    .bind(po_short.worker_id)
    .bind(po_short.purchase_time)
    .bind(po_short.pay_status)
    .fetch_one(&mut tx)
    .await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?
    .get(0);
    for po_detail in po_details {
        sqlx::query(
            "INSERT INTO purchase_detail (purchase_id, goods_id, goods_num) VALUES ($1, $2, $3)",
        )
        .bind(po_id)
        .bind(po_detail.goods_id)
        .bind(po_detail.goods_num)
        .execute(&mut tx)
        .await
        .or_else(|reason| {
            // println!("Error: {}", reason);
            Err(reason.to_string())
        })?;
    }
    tx.commit().await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    Ok(po_id.to_string())
}

#[tauri::command(async)]
pub async fn query_purchase(po: PoQueryParams) -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let mut condition = match po {
        PoQueryParams {
            purchase_id: Some(purchase_id),
            worker_id: Some(worker_id),
            start_time: _,
            end_time: _,
        } => format!(
            "purchase_id = {} and worker_id = {}",
            purchase_id, worker_id
        ),
        PoQueryParams {
            purchase_id: Some(purchase_id),
            worker_id: None,
            start_time: _,
            end_time: _,
        } => format!("purchase_id = {}", purchase_id),
        PoQueryParams {
            purchase_id: None,
            worker_id: Some(worker_id),
            start_time: _,
            end_time: _,
        } => format!("worker_id = {}", worker_id),
        PoQueryParams {
            purchase_id: None,
            worker_id: None,
            start_time: _,
            end_time: _,
        } => "1=1".to_string(),
    };
    if po.start_time.is_some() && po.end_time.is_some() {
        condition += &format!(
            " and purchase_time between '{}' and '{}'",
            po.start_time.unwrap(),
            po.end_time.unwrap()
        )
    }
    info!("{}", condition);
    let po = PoManager::query(pool.get_pool(), &condition)
        .await
        .or_else(|reason| {
            // println!("Error: {}", reason);
            Err(reason.to_string())
        })?;
    let po_short = po.0;
    let po_detail = po.1;
    let mut wrappers: Vec<PoWrapper> = Vec::new();
    for short in &po_short {
        let mut wrapper = PoWrapper {
            purchase_id: short.purchase_id,
            worker_id: short.worker_id,
            purchase_time: short.purchase_time,
            pay_status: short.pay_status.clone(),
            po_details: Vec::new(),
        };
        for detail in &po_detail {
            if detail[0].purchase_id == short.purchase_id {
                wrapper.po_details = detail.clone();
            }
        }
        wrappers.push(wrapper);
    }
    let wrapper_json = serde_json::to_string(&wrappers).map_err(|reason| reason.to_string())?;
    info!("{}", wrapper_json);
    Ok(wrapper_json)
}

#[tauri::command]
pub async fn get_new_purchase_id() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let row = sqlx::query("SELECT purchase_id FROM purchase ORDER BY purchase_id DESC LIMIT 1")
        .fetch_one(pool.get_pool())
        .await
        .or_else(|reason| {
            // println!("Error: {}", reason);
            Err(reason.to_string())
        })?;
    let mut purchase_id: i32 = row.get(0);
    purchase_id += 1;
    Ok(purchase_id.to_string())
}
