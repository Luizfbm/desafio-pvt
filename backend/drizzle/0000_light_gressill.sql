CREATE TABLE "alocacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"analista_id" uuid NOT NULL,
	"papel" text,
	"data_inicio" date,
	"data_fim" date,
	"horas_planejadas" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text,
	"codigo_rm" text NOT NULL,
	CONSTRAINT "analistas_codigo_rm_unique" UNIQUE("codigo_rm")
);
--> statement-breakpoint
CREATE TABLE "apontamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"analista_id" uuid NOT NULL,
	"data" date NOT NULL,
	"horas" integer NOT NULL,
	"descricao" text,
	"origem" text DEFAULT 'RM'
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text,
	"codigo_rm" text NOT NULL,
	CONSTRAINT "clientes_codigo_rm_unique" UNIQUE("codigo_rm")
);
--> statement-breakpoint
CREATE TABLE "faturamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"competencia" text NOT NULL,
	"valor_faturado" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projetos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"codigo_rm" text NOT NULL,
	"nome" text NOT NULL,
	"data_inicio" date,
	"data_fim_prevista" date,
	"horas_vendidas" integer DEFAULT 0 NOT NULL,
	"valor_contrato" integer DEFAULT 0 NOT NULL,
	"status_projeto" text DEFAULT 'ativo' NOT NULL,
	"ultima_sincronizacao_rm" timestamp with time zone,
	CONSTRAINT "projetos_codigo_rm_unique" UNIQUE("codigo_rm")
);
--> statement-breakpoint
ALTER TABLE "alocacoes" ADD CONSTRAINT "alocacoes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alocacoes" ADD CONSTRAINT "alocacoes_analista_id_analistas_id_fk" FOREIGN KEY ("analista_id") REFERENCES "public"."analistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_analista_id_analistas_id_fk" FOREIGN KEY ("analista_id") REFERENCES "public"."analistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faturamentos" ADD CONSTRAINT "faturamentos_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;