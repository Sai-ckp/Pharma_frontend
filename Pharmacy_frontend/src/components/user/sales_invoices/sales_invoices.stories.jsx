import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {sales_invoices} from './sales_invoices';

const meta: Meta<typeof sales_invoices> = {
  component: sales_invoices,
};

export default meta;

type Story = StoryObj<typeof sales_invoices>;

export const Basic: Story = {args: {}};
