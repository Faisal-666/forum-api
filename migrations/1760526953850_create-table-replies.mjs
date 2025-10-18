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
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    content: {
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
    comment_id: {
      type: 'VARCHAR(30)',
      references: '"comments"(id)',
      onDelete: 'CASCADE',
      notNull: true,
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
  pgm.dropTable('replies');
};
