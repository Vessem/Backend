#[macro_use] extern crate rocket;

use rocket::response::Redirect;

mod types;
mod paths;

#[get("/")]
fn home() -> Redirect {
    Redirect::to("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![
            home
        ])
        .mount("/user", routes![
            paths::user::get_user_by_id,
        ])
        .mount("/language", routes![
            paths::language::get_language_by_id
        ])
}