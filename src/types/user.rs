use rocket::serde::Serialize;

#[derive(Serialize)]
#[serde(crate= "rocket::serde")]
pub struct User {
    user_id: i32
}

impl User {
    pub fn new(user_id: i32) -> Self {
        User {
            user_id
        }
    }
}