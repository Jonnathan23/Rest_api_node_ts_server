import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
    tableName: 'products'
})

class Products extends Model {
    @Column({
        type: DataType.STRING(100)        
    })
    name!: string

    @Column({
        type: DataType.FLOAT(5, 2)
    })
    declare price: number

    @Default(true)
    @Column({ type: DataType.BOOLEAN })
    declare availability: boolean

}

export default Products