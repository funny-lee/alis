use crate::dal::manager::Manage;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use eyre::Result;
use sqlx::postgres::PgPool;

use super::po::Po;

#[derive(Debug, Clone, Default, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct Arrival {
    #[builder(setter(into))]
    pub warehouse_id: i32,
    #[builder(setter(into))]
    pub arrival_id: i32,
    #[builder(setter(into))]
    pub arrival_time: DateTime<Utc>,
    #[builder(setter(into))]
    pub arrival_total_batch: i32,
    #[builder(setter(into))]
    pub arrival_batch: i32,
    #[builder(setter(into))]
    pub purchase_id: i32,
}

pub struct ArrivalManager {
    pool: PgPool,
}
impl From<Po> for Arrival {
    fn from(po: Po) -> Self {
        let mut arrival = Arrival::default();
        arrival.purchase_id = po.po_short.purchase_id;
        arrival
    }
}
impl ArrivalManager {
    pub fn new(pool: &PgPool) -> Self {
        ArrivalManager { pool: pool.clone() }
    }
    pub async fn get_all(&self) -> Result<Vec<Arrival>> {
        let mut tx = self.pool.begin().await?;
        let arrivals: Vec<Arrival> = sqlx::query_as(
			"SELECT warehouse_id, arrival_id, arrival_time, arrival_total_batch, arrival_batch, purchase_id FROM arrival",
		)
		.fetch_all(&mut tx)
		.await?;
        Ok(arrivals)
    }
    async fn delete(pool: &PgPool, arrival_id: i32) -> Result<bool> {
        let mut tx = pool.begin().await?;

        sqlx::query("DELETE FROM arrival WHERE arrival_id = $1 RETURNING arrival_id")
            .bind(arrival_id)
            .fetch_one(&mut tx)
            .await?;
        tx.commit().await?;
        Ok(true)
    }
}

#[async_trait]
impl Manage for Arrival {
    async fn create(&self, pool: &PgPool) -> Result<i32> {
        let mut tx = pool.begin().await?;
        let arrival_id: i32 = sqlx::query!(
			"INSERT INTO arrival (warehouse_id, arrival_time, arrival_total_batch, arrival_batch, purchase_id) VALUES ($1, $2, $3, $4, $5) RETURNING arrival_id",
		self.warehouse_id,
		self.arrival_time,
		self.arrival_total_batch,
		self.arrival_batch,
		self.purchase_id)
		.fetch_one(&mut tx)
		.await?
		.arrival_id;
        tx.commit().await?;
        Ok(arrival_id)
    }
    async fn update(&self, query: &str, pool: &PgPool) -> Result<bool> {
        let mut tx = pool.begin().await?;
        sqlx::query(query).execute(&mut tx).await?;
        tx.commit().await?;
        Ok(true)
    }
}
