/**
 * This file contains the code for setting permissions on non-public commands.
 * The SlashCommandBuilder doesn't have any methods that allow you to set specific permissions for commands.
 * For restricted commands, we set the default permissions to false and then on deploy of the commands,
 * we run setCommandPermissions to assign the appropriate permissons. In some cases, permissions are checked
 * at the time the command is run. This is due to the Discord API limiting the number of permission overwrites 
 * through the API to 10. In our case, this means that only up to 10 roles can be alotted permissions per command.
 * 
 *
 * - addCC: MANAGE_CHANNELS, MANAGE_ROLES
 * - addHwChannel: MANAGE_CHANNELS, MANAGE_ROLES
 * - removeHwChannel: MANAGE_CHANNELS, MANAGE_ROLES
 * - addHwCheckerRoles: MANAGE_CHANNELS, MANAGE_ROLES
 * - removeHwCheckerRoles: MANAGE_CHANNELS, MANAGE_ROLES
 * - setMessageChannel: MANAGE_CHANNELS, MANAGE_ROLES
 */

const { Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandPermissionType } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const customPermissions = require('./customPermissions.json');

const commandsWithPermissions = [
  // can MANAGE_ROLES and MANAGE_CHANNELS
  {
    permissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_ROLES],
    roleNames: [
      'addcc',
      'addhwchannel',
      'addhwcheckerrole',
      'setmessagechannel',
      'removehwchannel',
      'removehwcheckerrole',
      'addpermissions',
      'findcc',
      'removepermissions',
      'log',
      'loghw',
      'loghwclass',
    ]
  },
];

module.exports = {
  setCommandPermissions: async (commands) => {
    const rest = new REST({ version: '9' }).setToken(token);
    const filteredCommands = commands.filter(command => command.default_permission === false);

    const roles = await rest.get(
      Routes.guildRoles(guildId)
    );

    // Build permissions body 
    const permissionsBody = [];
    commandsWithPermissions.forEach(obj => {
      const rolesWithPermissions = roles.filter(role => {
        const permission = new Permissions(role.permissions)
        return permission.has(obj.permissions);
      }).map(role => {
        return {
          id: role.id,
          type: ApplicationCommandPermissionType.Role,
          permission: true
        }
      })
      console.log(rolesWithPermissions);
      obj.roleNames.map(name => {
        console.log(name);
        const comm = filteredCommands.find(command => command.name === name);
        if(comm.id in customPermissions){
          permissionsBody.push({ id: comm.id, permissions: rolesWithPermissions.concat(customPermissions[comm.id].permissions) });
        }
        else {
          permissionsBody.push({ id: comm.id, permissions: rolesWithPermissions });
        }
      });
    });

    try {
      await rest.put(
        Routes.guildApplicationCommandsPermissions(clientId, guildId),
        { body: permissionsBody },
      );
    } catch (error) {
      console.error(error)
    }
  }
}
