import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {inventory_ledger} from './inventory_ledger';

const meta: Meta<typeof inventory_ledger> = {
  component: inventory_ledger,
};

export default meta;

type Story = StoryObj<typeof inventory_ledger>;

export const Basic: Story = {args: {}};
