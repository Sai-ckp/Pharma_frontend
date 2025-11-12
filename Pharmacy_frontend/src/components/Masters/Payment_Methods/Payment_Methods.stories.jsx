import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Payment_Methods} from './Payment_Methods';

const meta: Meta<typeof Payment_Methods> = {
  component: Payment_Methods,
};

export default meta;

type Story = StoryObj<typeof Payment_Methods>;

export const Basic: Story = {args: {}};
