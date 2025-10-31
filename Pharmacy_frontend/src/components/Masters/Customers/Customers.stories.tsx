import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Customers} from './Customers';

const meta: Meta<typeof Customers> = {
  component: Customers,
};

export default meta;

type Story = StoryObj<typeof Customers>;

export const Basic: Story = {args: {}};
