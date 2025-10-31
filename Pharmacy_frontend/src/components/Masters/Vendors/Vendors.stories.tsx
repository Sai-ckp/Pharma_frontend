import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Vendors} from './Vendors';

const meta: Meta<typeof Vendors> = {
  component: Vendors,
};

export default meta;

type Story = StoryObj<typeof Vendors>;

export const Basic: Story = {args: {}};
