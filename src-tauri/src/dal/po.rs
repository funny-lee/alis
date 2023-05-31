use crate::dal::manager::Manage;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use eyre::Result;
use sqlx::{postgres::PgPool, Pool, Postgres};

#[derive(Debug, Clone, Default, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct PoShort {
    #[builder(setter(into))]
    pub purchase_id: i32,
    #[builder(setter(into))]
    pub worker_id: i32,
    #[builder(setter(into))]
    pub purchase_time: DateTime<Utc>,
    #[builder(setter(into))]
    pub pay_status: String,
}
#[derive(Debug, Clone, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct PoDetail {
    #[builder(setter(into))]
    pub item_id: i32,
    #[builder(setter(into))]
    pub purchase_id: i32,
    #[builder(setter(into))]
    pub goods_id: i32,
    #[builder(setter(into))]
    pub goods_num: i32,
    #[builder(setter(into))]
    pub goods_name: String,
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, Builder)]
pub struct Po {
    #[builder(setter(into))]
    pub po_details: Vec<PoDetail>,
    #[builder(setter(into))]
    pub po_short: PoShort,
}
pub struct PoManager {
    pool: PgPool,
}
impl PoManager {
    pub fn new(pool: &PgPool) -> Self {
        PoManager { pool: pool.clone() }
    }
    pub async fn get_all(&self) -> Result<(Vec<PoShort>, Vec<Vec<PoDetail>>)> {
        let mut po_all_detail: Vec<Vec<PoDetail>> = Vec::with_capacity(6);
        let mut tx = self.pool.begin().await?;
        let po_shorts: Vec<PoShort> = sqlx::query_as(
            "SELECT purchase_id, worker_id, purchase_time, pay_status FROM purchase",
        )
        .fetch_all(&mut tx)
        .await?;
        for po_short in &po_shorts {
            let po_details: Vec<PoDetail> = sqlx::query_as(
                "SELECT item_id, purchase_id, purchase_detail.goods_id, goods_num ,goods_name FROM purchase_detail,goods WHERE purchase_detail.goods_id = goods.goods_id and purchase_id = $1")
                .bind(po_short.purchase_id)
            .fetch_all(&mut tx)
            .await?;

            po_all_detail.push(po_details);
        }
        tx.commit().await?;
        Ok((po_shorts, po_all_detail))
    }
    pub async fn delete(pool: &PgPool, purchase_id: i32) -> Result<bool> {
        let mut tx = pool.begin().await?;
        sqlx::query("DELETE FROM purchase WHERE purchase_id = $1")
            .bind(purchase_id)
            .execute(&mut tx)
            .await?;
        tx.commit().await?;
        Ok(true)
    }
}

#[async_trait]
impl Manage for Po {
    async fn create(&self, pool: &PgPool) -> Result<i32> {
        let mut tx = pool.begin().await?;
        let purchase_id = sqlx::query!(
            r#"
            INSERT INTO purchase (worker_id, purchase_time, pay_status)
            VALUES ($1, $2, $3)
            RETURNING purchase_id
            "#,
            self.po_short.worker_id,
            self.po_short.purchase_time,
            self.po_short.pay_status
        )
        .fetch_one(&mut tx)
        .await?
        .purchase_id;

        for po_detail in &self.po_details {
            sqlx::query("INSERT INTO purchase_detail (purchase_id, goods_id, goods_num) VALUES ($1, $2, $3)")
                .bind(purchase_id)
                .bind(po_detail.goods_id)
                .bind(po_detail.goods_num)
                .execute(&mut tx)
                .await?;
        }
        tx.commit().await?;
        Ok(purchase_id)
    }

    async fn update(&self, my_query: &str, pool: &PgPool) -> Result<bool> {
        let mut tx = pool.begin().await?;
        sqlx::query(my_query).execute(&mut tx).await?;
        tx.commit().await?;
        Ok(true)
    }
}
