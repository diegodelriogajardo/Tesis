import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Usuario from './usuario.js';  // Importar el modelo Paciente

// Modelo para la tabla Ficha
const Ficha = sequelize.define('ficha', {
    id_ficha: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE
    },
    resumen: {
        type: DataTypes.TEXT
    },
    observaciones: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false
});

// Establecer la relación: Un paciente puede tener muchas fichas y una ficha pertenece a un paciente
// Importación dinámica de Paciente para evitar la dependencia circular
(async () => {
    const Usuario = (await import('./usuario.js')).default;

    // Establecer la relación: Un usuario puede tener muchas fichas y una ficha pertenece a un usuario
    Usuario.hasMany(Ficha, { foreignKey: 'id_paciente', sourceKey: 'id_usuario' });
    Ficha.belongsTo(Usuario, { foreignKey: 'id_paciente', sourceKey: 'id_usuario' });
})();

export default Ficha;
