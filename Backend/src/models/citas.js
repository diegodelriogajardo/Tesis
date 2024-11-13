import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
//import Paciente from './paciente.js';
//import Especialista from './especialista.js';
import Atencion from './atencion.js';
import Usuario from './usuario.js';

// Modelo para la tabla cita
const Cita = sequelize.define('cita', {
    id_cita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fecha_cita: {
        type: DataTypes.DATE
    },
    estado: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false
});

// Relaciones

//Paciente.hasMany(Cita, { foreignKey: 'rut', sourceKey: 'rut' });
// Establecer la relación: Un paciente puede seguir muchos tratamientos
//Especialista.hasMany(Cita, { foreignKey: 'id_especialista', sourceKey: 'id_especialista' });
(async () => {
    const Usuario = (await import('./usuario.js')).default;
Usuario.hasMany(Cita, { foreignKey: 'id_especialista', sourceKey: 'id_usuario' })
Usuario.hasMany(Cita, { foreignKey: 'id_paciente', sourceKey: 'id_usuario' })

Cita.hasMany(Atencion, { foreignKey: 'id_cita', sourceKey: 'id_cita' });

})();
export default Cita;
