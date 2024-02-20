const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('postgres://localhost:5432/assignment_db');

class Account extends Model {}

Account.init({
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  last_modified: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  sequelize,
  modelName: 'Account',
  timestamps: false,
  hooks: {
    beforeCreate: async (account) => {
      if (account.password) {
        const salt = await bcrypt.genSaltSync(10, 'a');
        account.password = bcrypt.hashSync(account.password, salt);
      }
    },
    beforeUpdate: async (account) => {
      if (account.password) {
        const salt = await bcrypt.genSaltSync(10, 'a');
        account.password = bcrypt.hashSync(account.password, salt);
      }
    }
  }
});

module.exports = Account;
