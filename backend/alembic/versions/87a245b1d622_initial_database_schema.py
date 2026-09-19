"""initial database schema

Revision ID: 87a245b1d622
Revises:
Create Date: 2026-08-08 11:11:07.241224

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "87a245b1d622"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the initial restaurants table."""

    op.create_table(
        "restaurants",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("location", sa.String(length=100), nullable=False),
        sa.Column("cuisine", sa.String(length=50), nullable=False),
        sa.Column("rating", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("available_tables", sa.Integer(), nullable=False, server_default="0"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_restaurants_id",
        "restaurants",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Drop the restaurants table."""

    op.drop_index(
        "ix_restaurants_id",
        table_name="restaurants",
    )

    op.drop_table("restaurants")