use crate::dal::manager::Manage;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use eyre::Result;
use sqlx::postgres::PgPool;

#[derive(Debug, Clone, Default, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct Supplier {
    #[builder(setter(into))]
    pub supplier_id: i32,
    #[builder(setter(into))]
    pub supplier_name: String,
    #[builder(setter(into))]
    pub supplier_phonenum: String,
    #[builder(setter(into))]
    pub supplier_loc: String,
    #[builder(setter(into))]
    pub supplier_type: String,
}

pub struct SupplierManager {
    pool: PgPool,
}

impl SupplierManager {
    pub fn new(pool: &PgPool) -> Self {
        SupplierManager { pool: pool.clone() }
    }
    pub async fn get_all(&self) -> Result<Vec<Supplier>> {
        let mut tx = self.pool.begin().await?;
        let suppliers: Vec<Supplier> = sqlx::query_as(
			"SELECT supplier_id, supplier_name, supplier_phonenum, supplier_loc, supplier_type FROM supplier",
		)
		.fetch_all(&mut tx)
		.await?;
        Ok(suppliers)
    }
    pub async fn delete(pool: &PgPool, supplier_id: i32) -> Result<bool> {
        let mut tx = pool.begin().await?;

        sqlx::query("DELETE FROM supplier WHERE supplier_id = $1 RETURNING supplier_id")
            .bind(supplier_id)
            .fetch_one(&mut tx)
            .await?;
        tx.commit().await?;
        Ok(true)
    }
    pub async fn get_by_id(&self, supplier_id: i32) -> Result<Supplier> {
        let mut tx = self.pool.begin().await?;
        let supplier: Supplier = sqlx::query_as(
			"SELECT supplier_id, supplier_name, supplier_phonenum, supplier_loc, supplier_type FROM supplier WHERE supplier_id = $1",
		)
		.bind(supplier_id)
		.fetch_one(&mut tx)
		.await?;
        Ok(supplier)
    }
}
