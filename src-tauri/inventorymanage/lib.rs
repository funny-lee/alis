#[async_trait]
pub trait InvManage {
    async fn new();
    async fn delete();
    async fn get_status();
    async fn add();
    async fn sub();
}
