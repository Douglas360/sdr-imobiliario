-- Adicionar coluna link_site a tabela imoveis
ALTER TABLE public.imoveis ADD COLUMN IF NOT EXISTS link_site TEXT;
