use crate::dal::supplier::SupplierManager;

#[tauri::command(async)]
pub async fn show_all_supplier() -> Result<String, String> {
    let pool = crate::POOL.read().await;
    let supplier_manager = SupplierManager::new(pool.get_pool());
    let supplier = supplier_manager.get_all().await.or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    let supplier_json = serde_json::to_string(&supplier).or_else(|reason| {
        // println!("Error: {}", reason);
        Err(reason.to_string())
    })?;
    // println!("supplier_json: {}", supplier_json);
    Ok(supplier_json)
}
