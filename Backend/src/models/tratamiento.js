import Sequelize from 'sequelize';
import { sequelize } from '../database/database.js';
//import Especialista from './especialista.js';
//import Paciente from './paciente.js';
import Diagnostico from './diagnostico.js';
import Usuario from './usuario.js';

const Tratamiento = sequelize.define('tratamiento', {
    id_tratamiento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: Sequelize.TEXT
    },
    fecha_inicio: {
        type: Sequelize.DATE
    },
    fecha_fin: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
});

// Establecer relaciones
// Un especialista supervisa muchos tratamientos


(async () => {
    const Usuario = (await import('./usuario.js')).default;
    Usuario.hasMany(Tratamiento, { foreignKey: 'id_especialista', sourceKey: 'id_usuario' });
    Tratamiento.belongsTo(Usuario, { foreignKey: 'id_especialista', targetKey: 'id_usuario' });
    
    // Un paciente sigue muchos tratamientos
    Usuario.hasMany(Tratamiento, { foreignKey: 'id_paciente', sourceKey: 'id_usuario' });
    Tratamiento.belongsTo(Usuario, { foreignKey: 'id_paciente', targetKey: 'id_usuario' });
    
    // Un diagnóstico puede prescribir muchos tratamientos
    Diagnostico.hasMany(Tratamiento, { foreignKey: 'id_diagnostico', sourceKey: 'id_diagnostico' });
    Tratamiento.belongsTo(Diagnostico, { foreignKey: 'id_diagnostico', targetKey: 'id_diagnostico' });

})();

export default Tratamiento;
