create database laramie_ingresos_publicos;
create user user_laramie_ingresos_publicos with password '123456';
grant all privileges on database laramie_ingresos_publicos to user_laramie_ingresos_publicos;
alter user user_laramie_ingresos_publicos with superuser;

create database laramie_administracion;
create user user_laramie_administracion with password '123456';
grant all privileges on database laramie_administracion to user_laramie_administracion;
alter user user_laramie_administracion with superuser;

create database laramie_seguridad;
create user user_laramie_seguridad with password '123456';
grant all privileges on database laramie_seguridad to user_laramie_seguridad;
alter user user_laramie_seguridad with superuser;

create database laramie_comunicacion;
create user user_laramie_comunicacion with password '123456';
grant all privileges on database laramie_comunicacion to user_laramie_comunicacion;
alter user user_laramie_comunicacion with superuser;

create database laramie_tesoreria;
create user user_laramie_tesoreria with password '123456';
grant all privileges on database laramie_tesoreria to user_laramie_tesoreria;
alter user user_laramie_tesoreria with superuser;

create user postgres with password 'postgres';
alter user postgres with superuser;
