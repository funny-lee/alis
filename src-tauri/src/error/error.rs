#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("Database error")]
    DbError(#[from] sqlx::Error),
    #[error("IO error")]
    IoError(#[from] std::io::Error),
}
