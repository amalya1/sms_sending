-- migrate:up


-- create contact status, valid_status, opt_in_type, opt_out_type
create type contact_status as enum ('active', 'deleted');
create type contact_valid_status as enum ('valid', 'invalid');
create type contact_source_type as enum ('company', 'contact');


-- create contacts table
create table contacts
(
    id                  uuid    primary  key           not null,
    status              contact_status                 not null,
    valid_status        contact_valid_status           not null,
    company_id          uuid                           not null references companies(id),
    phone_number        text                           not null,
    email               text                           null,
    first_name          text                           null,
    last_name           text                           null,
    birthdate           timestamp with time zone       null,
    contact_metadata    jsonb                          null,
    time_zone           text                           null,
    opt_in_type         contact_source_type            not null,
    opt_in_date         timestamp with time zone       not null,
    opt_out_type        contact_source_type            null,
    opt_out_date        timestamp with time zone       null,
    created_by          uuid                           null references users(id),
    updated_by          uuid                           null references users(id),
    created_at          timestamp with time zone       not null,
    updated_at          timestamp with time zone       not null,
    deleted_at          timestamp with time zone       null
);


-- Name: idx_company_contact_phone; Type: INDEX
create unique index idx_company_contact_phone ON contacts (company_id, phone_number);


-- migrate:down
drop index idx_company_contact_phone;
drop table contacts;
drop type contact_status;
drop type contact_valid_status;
drop type contact_source_type;
