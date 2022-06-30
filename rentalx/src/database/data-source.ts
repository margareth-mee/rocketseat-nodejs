import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "docker",
    password: "ignite",
    database: "rentalx",
    synchronize: false,
    logging: false,
    entities: [],
    migrations: ["src/database/migrations/*.ts"],
    subscribers: []
});

export function createConnection(host = "database"): Promise<DataSource> {
    return AppDataSource.setOptions({ host }).initialize();
}

// export default AppDataSource;
