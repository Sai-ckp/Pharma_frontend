import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {ndpsdailyentries} from './ndpsdailyentries';

const meta: Meta<typeof ndpsdailyentries> = {
  component: ndpsdailyentries,
};

export default meta;

type Story = StoryObj<typeof ndpsdailyentries>;

export const Basic: Story = {args: {}};
