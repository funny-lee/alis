use crate::dal::arrival::ArrivalManager;
#[tauri::command(async)]
pub async fn show_all_arrival() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let arrival_manager = ArrivalManager::new(pool.get_pool());
    let arrival = arrival_manager.get_all().await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    let arrival_json = serde_json::to_string(&arrival).or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    // println!("arrival_json: {}", arrival_json);
    Ok(arrival_json)
}

 