CREATE DATABASE abaco;

\connect abaco;

CREATE ROLE abaco_gerente;
ALTER ROLE abaco_gerente SET search_path TO public;
GRANT ALL PRIVILEGES ON DATABASE abaco TO abaco_gerente;

CREATE USER abaco WITH PASSWORD 'abaco' IN ROLE abaco_gerente;
