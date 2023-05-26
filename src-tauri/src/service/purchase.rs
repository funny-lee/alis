use chrono::{DateTime, Utc};

use crate::dal::po::{PoDetail, PoManager};
// use crate::error::error::Error;
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct PoWrapper {
    purchase_id: i32,
    worker_id: i32,
    purchase_time: DateTime<Utc>,
    pay_status: String,
    po_details: Vec<PoDetail>,
}
#[tauri::command(async)]
pub async fn show_purchase() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let po_manager = PoManager::new(pool.get_pool());
    let po = po_manager.get_all().await.or_else(|reason| {
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

    let wrapper_json = serde_json::to_string(&wrappers).or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    println!("{}", wrapper_json);
    Ok(wrapper_json)
}
