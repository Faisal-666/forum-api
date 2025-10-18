// @ts-check
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('thread', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
      references: '"users"(username)',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      references: '"users"(username)',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(30)',
      references: '"thread"(id)',
      notNull: true,
      onDelete: 'CASCADE',
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('comments');
  pgm.dropTable('thread');
};
