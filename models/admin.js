module.exports = function (sequelize, DataTypes) {
    var Admin = sequelize.define("Admin", {
        admin_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        organization_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        lat: {
            type: DataTypes.DECIMAL(17 , 14),
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            }
        },
        lng: {
            type: DataTypes.DECIMAL(17, 14),
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            }
        },
        non_profit_id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'admin',
            isIn: [
                ['admin', 'user']
            ]
        }
    }
        // // TODO
        // // do we need to associate users and admins here?
        // ,
        // // To create an association between Users and Admins
        // {
        //     classMethods: {
        //         associate: function(models) {
        //             //
        //             Admin.hasMany(models.Admins);
        //         }
        //     }
        // }
    )
    return Admin;
};