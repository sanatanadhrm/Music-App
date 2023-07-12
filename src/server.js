require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const TokenManager = require('./tokenize/TokenManager');

const AlbumsService = require('./service/Albums/AlbumsService');
const SongsService = require('./service/Songs/SongsService');
const UsersService = require('./service/users/UsersService');
const AuthenticationsService = require('./service/authentications/AuthenticationsServices');
const PlaylistsService = require('./service/playlists/PlaylistsService');
const SongsPlaylistsService = require('./service/SongsPlaylists/SongsPlaylistsService');
const ActivitiesService = require('./service/Activities/ActivitiesService');
const CollaborationsService = require('./service/Collaborations/CollaborationsService');

const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const songsplaylists = require('./api/songsplaylists');
const activities = require('./api/activities');
const collaborations = require('./api/collaborations');

const ClientError = require('./exceptions/ClientError');

const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const SongsPlaylistsValidator = require('./validator/songsplaylists');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const songsplaylistsService = new SongsPlaylistsService();
  const activitiesService = new ActivitiesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register(
    [
      {
        plugin: albums,
        options: {
          service: albumsService,
          validator: AlbumsValidator,
        },
      },
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
      },
      {
        plugin: users,
        options: {
          service: usersService,
          validator: UsersValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authenticationsService,
          usersService,
          tokenManager: TokenManager,
          validator: AuthenticationsValidator,
        },
      },
      {
        plugin: playlists,
        options: {
          service: playlistsService,
          validator: PlaylistsValidator,
        },
      },
      {
        plugin: songsplaylists,
        options: {
          songsplaylistsService,
          playlistsService,
          activitiesService,
          validator: SongsPlaylistsValidator,
        },
      },
      {
        plugin: activities,
        options: {
          playlistsService,
          activitiesService,
        },
      },
      {
        plugin: collaborations,
        options: {
          collaborationsService,
          playlistsService,
          validator: CollaborationsValidator,
        },
      },
    ],
  );
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
