-- migrate:up


-- create user status, type
create type user_status as enum ('active', 'pending', 'deleted');
create type user_type as enum ('user', 'admin');



-- create users table
create table users
(
    id                              uuid    primary  key        default gen_random_uuid(),
    status                          user_status                 not null,
    type                            user_type                   not null,
    email                           text                        not null,
    phone_number                    text                        null,
    password                        text                        null,
    first_name                      text                        not null,
    last_name                       text                        not null,
    created_by                      uuid                        null  references users (id),
    updated_by                      uuid                        null  references users (id),
    reset_password_token            text                        null,
    reset_password_token_expire     timestamp with time zone    null,
    created_at                      timestamp with time zone    not null,
    updated_at                      timestamp with time zone    not null,
    deleted_at                      timestamp with time zone    null
);


-- Name: idx_users_email; Type: INDEX
create unique index idx_users_email ON users (email);



-- Insert admin user
INSERT INTO users (status, type, email, password, first_name, last_name, created_at, updated_at)
VALUES ('active', 'admin', 'adminbhi@mailinator.com', '$2b$10$Hp505HirJwAEpJMWuLjKNuFrcSs10oN4oPTMOSJk4ZhrVsM4C7Lw2', 'Admin', 'Admin', now(), now());




-- migrate:down
drop index idx_users_email;
drop table users;
drop type user_status;
drop type user_type;
