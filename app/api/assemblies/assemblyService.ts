// services/assemblyService.ts

export interface AssemblyLeader {
  Id: number;
  FirstName: string;
  OtherNames: string;
  Phone: string;
  Email: string;
  Gender: string;
  PasswordHash: string;
  Assembly: string;
  CreatedAt: string;
  StatusId: number;
  SocialMediaName: string;
  ResidentialAddress: string;
  DateOfBirth: string;
  MaritalStatus: string;
  NumberOfChildren: number;
  UserRole: number;
  SpouseName: string;
  MustChangePassword: boolean;
  Token: string;
  UpdatePhoneNumber: boolean;
  ProfileImage: string | null;
  ProfilePictureUrl: string | null;
  GoogleId: string | null;
  AuthProvider: string | null;
  LastLoginAt: string;
  IsProfileComplete: boolean;
  FailedLoginAttempts: number;
  IsLocked: boolean;
  LockedUntil: string | null;
  IsElder: boolean;
  MaskedPhone: string | null;
  MaskedEmail: string | null;
  RequiresOtp: boolean;
  MemberNumber: string;
}

export interface Assembly {
  Id: number;
  Name: string;
  Location: string;
  ContactPhone: string;
  ContactEmail: string;
  CreatedAt: string;
  AssemblyLeaderId: number | null;
  Latitude: number | null;
  Longitude: number | null;
  ProfileImage: string | null;
  AssemblyLeader: AssemblyLeader | null;
}

export interface ApiResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string | null;
  Data: Assembly[];
}

const API_BASE_URL = 'https://api.gospelcentresinternational.com';

export async function getAllAssemblies(): Promise<Assembly[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Assembly/GetAllAssemblies`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.IsSuccess) {
      throw new Error(data.Message || 'Failed to fetch assemblies');
    }

    return data.Data || [];
  } catch (error) {
    console.error('Error fetching assemblies:', error);
    throw error;
  }
}

// Function to get a single assembly by ID
export async function getAssemblyById(id: number): Promise<Assembly | null> {
  try {
    const assemblies = await getAllAssemblies();
    return assemblies.find(assembly => assembly.Id === id) || null;
  } catch (error) {
    console.error(`Error fetching assembly with ID ${id}:`, error);
    throw error;
  }
}