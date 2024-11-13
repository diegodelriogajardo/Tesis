import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Ficha from './ficha.js';
import Diagnostico from './diagnostico.js';

// Modelo para la tabla Atencion
const Atencion = sequelize.define('atencion', {
    id_atencion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fecha_atencion: {
        type: DataTypes.DATE
    },
    tipo_atencion: {
        type: DataTypes.TEXT
    },
    resumen: {
        type: DataTypes.TEXT
    },
    descripcion: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'atenciones',
    engine: 'InnoDB',
    timestamps: false
});

// Relaciones

(async () => {
    const Diagnostico = (await import('./diagnostico.js')).default;
    //const Especialista = (await import('./especialista.js')).default;

    // Relaciones entre modelos
    //Especialista.hasMany(Atencion, { foreignKey: 'id_especialista', sourceKey: 'id_especialista' });
    //Atencion.belongsTo(Especialista, { foreignKey: 'id_especialista', targetKey: 'id_especialista' });

    // Relaciones con otros modelos
    Ficha.hasMany(Atencion, { foreignKey: 'id_ficha', sourceKey: 'id_ficha' });
    Atencion.belongsTo(Ficha, { foreignKey: 'id_ficha', targetKey: 'id_ficha' });

    Atencion.hasMany(Diagnostico, { foreignKey: 'id_atencion', sourceKey: 'id_atencion' });
    Diagnostico.belongsTo(Atencion, { foreignKey: 'id_atencion', targetKey: 'id_atencion' });
})();

export default Atencion;
