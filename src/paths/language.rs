
#[get("/<id>")]
pub fn get_language_by_id(id: String) -> String {
    return format!("Language id is {}", id);
}