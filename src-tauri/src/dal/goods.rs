use crate::dal::manager::Manage;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use eyre::Result;
use sqlx::postgres::PgPool;

#[derive(Debug, Clone, Default, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct Goods {
    #[builder(setter(into))]
    pub goods_id: i32,
    #[builder(setter(into))]
    pub supplier_id: i32,
    #[builder(setter(into))]
    pub goods_name: String,
    #[builder(setter(into))]
    pub goods_price: f32,
    #[builder(setter(into))]
    pub goods_size: String,
    #[builder(setter(into))]
    pub goods_sku: String,
}

pub struct GoodsManager {
    pool: PgPool,
}

impl GoodsManager {
    pub fn new(pool: &PgPool) -> Self {
        GoodsManager { pool: pool.clone() }
    }
    pub async fn get_all(&self) -> Result<Vec<Goods>> {
        let mut tx = self.pool.begin().await?;
        let goods: Vec<Goods> = sqlx::query_as(
            "SELECT goods_id, supplier_id, goods_name, goods_price, goods_size, goods_sku FROM goods",
        )
        .fetch_all(&mut tx)
        .await?;
        Ok(goods)
    }
    pub async fn get_by_id(&self, goods_id: i32) -> Result<Goods> {
        let mut tx = self.pool.begin().await?;
        let goods: Goods = sqlx::query_as(
            "SELECT goods_id, supplier_id, goods_name, goods_price, goods_size, goods_sku FROM goods WHERE goods_id = $1",
        )
        .bind(goods_id)
        .fetch_one(&mut tx)
        .await?;
        Ok(goods)
    }
    pub async fn get_by_supplier_id(&self, supplier_id: i32) -> Result<Vec<Goods>> {
        let mut tx = self.pool.begin().await?;
        let goods: Vec<Goods> = sqlx::query_as(
            "SELECT goods_id, supplier_id, goods_name, goods_price, goods_size, goods_sku FROM goods WHERE supplier_id = $1",
        )
        .bind(supplier_id)
        .fetch_all(&mut tx)
        .await?;
        Ok(goods)
    }

    pub async fn insert(&self, goods: &Goods) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            "INSERT INTO goods (supplier_id, goods_name, goods_price, goods_size, goods_sku) VALUES ($1, $2, $3, $4, $5)",
        )
        .bind(goods.supplier_id)
        .bind(&goods.goods_name)
        .bind(goods.goods_price)
        .bind(&goods.goods_size)
        .bind(&goods.goods_sku)
        .execute(&mut tx)
        .await?;
        tx.commit().await?;
        Ok(())
    }
    pub async fn update(&self, goods: &Goods) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            "UPDATE goods SET supplier_id = $1, goods_name = $2, goods_price = $3, goods_size = $4, goods_sku = $5 WHERE goods_id = $6",
        )
        .bind(goods.supplier_id)
        .bind(&goods.goods_name)
        .bind(goods.goods_price)
        .bind(&goods.goods_size)
        .bind(&goods.goods_sku)
        .bind(goods.goods_id)
        .execute(&mut tx)
        .await?;
        tx.commit().await?;
        Ok(())
    }
    pub async fn delete(&self, goods_id: i32) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        sqlx::query("DELETE FROM goods WHERE goods_id = $1")
            .bind(goods_id)
            .execute(&mut tx)
            .await?;
        tx.commit().await?;
        Ok(())
    }
}
#[async_trait]
impl Manage for Goods {
    async fn create(&self, pool: &PgPool) -> Result<i32> {
        let mut tx = pool.begin().await?;
        let goods_id= sqlx::query("INSERT INTO goods (supplier_id, goods_name, goods_price, goods_size, goods_sku) VALUES ($1, $2, $3, $4, $5) RETURNING goods_id")
        .bind(self.supplier_id)
        .bind(&self.goods_name)
        .bind(self.goods_price)
        .bind(&self.goods_size)
        .bind(&self.goods_sku)
        .fetch_one(&mut tx)
        .await?;
        tx.commit().await?;
        Ok(1)
    }

    async fn update(&self, my_query: &str, pool: &PgPool) -> Result<bool> {
        let mut tx = pool.begin().await?;
        sqlx::query(my_query).execute(&mut tx).await?;
        tx.commit().await?;
        Ok(true)
    }
}
