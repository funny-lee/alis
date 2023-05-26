use async_trait::async_trait;
use eyre::Result;
use sqlx::postgres::PgPool;

#[async_trait]
pub trait Manage {
    async fn create(&self, pool: &PgPool) -> Result<i32>;
    //async fn get_all(pool: &PgPool) -> Result<Self::Output>;
    async fn update(&self, query: &str, pool: &PgPool) -> Result<bool>;
    async fn delete(&self, pool: &PgPool) -> Result<bool>;
}
