CREATE TABLE "movements" (
	"id"	INTEGER NOT NULL UNIQUE,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"moneda_from"	TEXT NOT NULL,
	"cantidad_from"	NUMERIC NOT NULL,
	"moneda_to"	TEXT NOT NULL,
	"cantidad_to"	NUMERIC NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
