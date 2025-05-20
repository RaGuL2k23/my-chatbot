const { NextResponse } = require("next/server")

export const GET = async (req) => {
  return NextResponse.json({ hail: 'ahi' })
}
 
