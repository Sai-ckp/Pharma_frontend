import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {unit} from './unit';

const meta: Meta<typeof unit> = {
  component: unit,
};

export default meta;

type Story = StoryObj<typeof unit>;

export const Basic: Story = {args: {}};
