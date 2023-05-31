use crate::dal::manager::Manage;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use eyre::Result;
use sqlx::postgres::PgPool;

#[derive(Debug, Clone, Default, sqlx::FromRow, serde::Serialize, serde::Deserialize, Builder)]
pub struct So {
    #[builder(setter(into))]
    pub goods_id: i32,
    #[builder(setter(into))]
    pub worker_id: i32,
    #[builder(setter(into))]
    pub dp_time: DateTime<Utc>,
    #[builder(setter(into))]
    pub dp_id: i32,
    #[builder(setter(into))]
    pub total_batch: i32,
    #[builder(setter(into))]
    pub now_batch: i32,
}
