-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.exchange_rates_log (
  id bigint NOT NULL DEFAULT nextval('exchange_rates_log_id_seq'::regclass),
  taxa_usd_brl numeric NOT NULL,
  fonte character varying DEFAULT 'AwesomeAPI'::character varying,
  registrado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT exchange_rates_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  auth_user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.expenses (
  id bigint NOT NULL DEFAULT nextval('expenses_id_seq'::regclass),
  user_id uuid NOT NULL,
  descricao text NOT NULL,
  quantidade numeric NOT NULL CHECK (quantidade > 0::numeric),
  categoria text NOT NULL CHECK (categoria = ANY (ARRAY['Essencial'::text, 'Comida'::text, 'Saúde'::text, 'Transporte'::text, 'Outros'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_profiles (
  id bigint NOT NULL DEFAULT nextval('user_profiles_id_seq'::regclass),
  user_id uuid NOT NULL UNIQUE,
  renda_mensal numeric DEFAULT 0,
  moeda_padrao text DEFAULT 'BRL'::text,
  tema text DEFAULT 'dark'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);