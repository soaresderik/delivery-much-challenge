SELECT 'CREATE DATABASE dmchallenge'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dmchallenge')\gexec
