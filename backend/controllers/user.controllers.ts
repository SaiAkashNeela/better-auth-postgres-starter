import { Context } from 'hono'
import { DB } from '~/config'

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  const users = await DB.user.findMany()
  return c.json(users)
}

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
  const id = c.req.param('id')

  const user = await DB.user.findUnique({
    where: { id },
  })

  if (!user) {
    return c.json(
      {
        success: false,
        message: 'User not found',
        error: 'No user found with the provided ID',
      },
      404
    )
  }

  return c.json(user)
}

/**
 * @api {put} /users/profile Edit User Profile
 * @apiGroup Users
 * @access Private
 */
export const editProfile = async (c: Context) => {
  try {
    const user = c.get('user')
    const body = await c.req.json()

    // Create an object to hold our updates
    const updates: any = {}

    // Only add fields to the update if they exist in the request body
    if (body.name !== undefined && body.name !== '') {
      updates.name = body.name.trim()
    }

    if (body.phone !== undefined && body.phone !== '') {
      // Simple phone validation
      if (!/^\+?[\d\s-]{7,15}$/.test(body.phone)) {
        return c.json(
          {
            success: false,
            message: 'Invalid phone number format',
          },
          400
        )
      }
      updates.phone = body.phone.trim()
    }

    if (body.image !== undefined && body.image !== '') {
      updates.image = body.image.trim()
    }

    // If no fields were provided, return early
    if (Object.keys(updates).length === 0) {
      return c.json(
        {
          success: false,
          message: 'No fields to update',
        },
        400
      )
    }

    // Update the user's profile with only the provided fields
    const updatedUser = await DB.user.update({
      where: { id: user.id },
      data: updates,
    })

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json(
      {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}

/**
 * @api {get} /users/profile Get User Profile
 * @apiGroup Users
 * @access Private
 */
export const getProfile = async (c: Context) => {
  const user = c.get('user')

  const profile = await DB.user.findUnique({
    where: { id: user.id },
  })

  if (!profile) {
    return c.json(
      {
        success: false,
        message: 'Profile not found',
        error: 'No profile found for the user',
      },
      404
    )
  }

  return c.json(profile)
}

/**
 * @api {delete} /users/:id Delete User
 * @apiGroup Users
 * @access Private
 */
export const deleteUser = async (c: Context) => {
  const id = c.req.param('id')

  try {
    // Prisma handles cascading deletes if configured in schema
    const deletedUser = await DB.user.delete({
      where: { id },
    })

    return c.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    // Prisma error for not found usually throws
    return c.json(
      {
        success: false,
        message: 'Failed to delete user',
        error: errorMessage,
      },
      500
    )
  }
}
