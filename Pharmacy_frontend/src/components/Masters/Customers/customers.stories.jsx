import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {customers} from './customers';

const meta: Meta<typeof customers> = {
  component: customers,
};

export default meta;

type Story = StoryObj<typeof customers>;

export const Basic: Story = {args: {}};
