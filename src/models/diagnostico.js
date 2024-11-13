import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Atencion from './atencion.js';
import Tratamiento from './tratamiento.js';

const Diagnostico = sequelize.define('diagnostico', {
    id_diagnostico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    fecha_diagnostico: {
        type: DataTypes.DATE
    }/*,
    id_atencion: {  // Asegúrate de usar el mismo nombre en ambas tablas
        type: DataTypes.INTEGER,
        allowNull: true
    }*/
}, {
    engine: 'InnoDB',
    timestamps: false
});

// Relaciones

// Importación dinámica de Atencion para evitar la dependencia circular
(async () => {
    const Atencion = (await import('./atencion.js')).default;

    // Establecer relaciones

    // Una atención incluye muchos diagnósticos
    Diagnostico.belongsTo(Atencion, { foreignKey: 'id_atencion', targetKey: 'id_atencion' });
    Atencion.hasMany(Diagnostico, { foreignKey: 'id_atencion', sourceKey: 'id_atencion' });

    // Un diagnóstico puede prescribir muchos tratamientos
    Diagnostico.hasMany(Tratamiento, { foreignKey: 'id_diagnostico', sourceKey: 'id_diagnostico' });
    Tratamiento.belongsTo(Diagnostico, { foreignKey: 'id_diagnostico', targetKey: 'id_diagnostico' });
})();

export default Diagnostico;
