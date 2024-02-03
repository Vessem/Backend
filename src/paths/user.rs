use crate::types::user::User;
use rocket::serde::json::Json;

#[get("/<id>")]
pub fn get_user_by_id(id: i32) -> Json<User> {
    return Json(User::new(id));
}