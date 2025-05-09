CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" varchar(255) NOT NULL,
	"street_nr" varchar(10) NOT NULL,
	"postal" varchar(10) NOT NULL,
	"city" varchar(20) NOT NULL,
	"country_id" integer NOT NULL,
	CONSTRAINT "address_street_street_nr_city_country_id_unique" UNIQUE("street","street_nr","city","country_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"postal" varchar(10) NOT NULL,
	"country_id" integer NOT NULL,
	CONSTRAINT "city_pk" UNIQUE("name","postal","country_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(45) NOT NULL,
	"code" varchar(2) NOT NULL,
	CONSTRAINT "country_name_unique" UNIQUE("name"),
	CONSTRAINT "country_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_nr" varchar(15) NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "customer_tax_nr_unique" UNIQUE("tax_nr"),
	CONSTRAINT "customer_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	CONSTRAINT "full_name" UNIQUE("first_name","last_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_loading_places" (
	"id" serial NOT NULL,
	"order_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	CONSTRAINT "order_loading_places_order_id_place_id_pk" PRIMARY KEY("order_id","place_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_nr" varchar(30) NOT NULL,
	"start_date" date DEFAULT now() NOT NULL,
	"end_date" date DEFAULT now() NOT NULL,
	"status_id" integer NOT NULL,
	"price_currency" numeric(10, 2) NOT NULL,
	"price_pln" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'PLN' NOT NULL,
	"currency_rate" numeric(10, 4) DEFAULT '1' NOT NULL,
	"truck_id" integer NOT NULL,
	"driver_id" integer NOT NULL,
	"customer_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "status" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL,
	CONSTRAINT "status_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "truck" (
	"id" serial PRIMARY KEY NOT NULL,
	"plate" varchar(10) NOT NULL,
	"insurance_endAt" date DEFAULT now() NOT NULL,
	"service_endAt" date DEFAULT now() NOT NULL,
	CONSTRAINT "truck_plate_unique" UNIQUE("plate")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_unloading_places" (
	"id" serial NOT NULL,
	"order_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	CONSTRAINT "order_unloading_places_order_id_place_id_pk" PRIMARY KEY("order_id","place_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "city" ADD CONSTRAINT "city_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_loading_places" ADD CONSTRAINT "order_loading_places_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_loading_places" ADD CONSTRAINT "order_loading_places_place_id_city_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_status_id_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_truck_id_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."truck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_unloading_places" ADD CONSTRAINT "order_unloading_places_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_unloading_places" ADD CONSTRAINT "order_unloading_places_place_id_city_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
