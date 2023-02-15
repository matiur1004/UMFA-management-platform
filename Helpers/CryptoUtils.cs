using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace ClientPortal.Helpers
{
    public static class CryptoUtils
    {
        private static string _key = "";
        private static AppSettings _options;

        public static void CryptoConfigure(IOptions<AppSettings> options)
        {
            _options = options.Value;
            _key = _options.EncryptionKey;
        }

        public static string EncryptString(string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(_key);
                aes.IV = iv;
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using MemoryStream memoryStream = new();
                using CryptoStream cryptoStream = new((Stream)memoryStream, encryptor, CryptoStreamMode.Write);
                using (StreamWriter streamWriter = new((Stream)cryptoStream))
                {
                    streamWriter.Write(plainText);
                }
                array = memoryStream.ToArray();
            }
            return Convert.ToBase64String(array);
        }

        public static string EncryptNumber(string plainNumStr)
        {
            byte[] clearBytes = Encoding.UTF8.GetBytes(plainNumStr);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new(_key, new byte[] {
                0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
            });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using MemoryStream ms = new();
                using (CryptoStream cs = new(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(clearBytes, 0, clearBytes.Length);
                    cs.Close();
                }
                plainNumStr = Convert.ToBase64String(ms.ToArray());
            }
            return plainNumStr;
        }

        public static string DecryptString(string cipherStr)
        {
            byte[] iv = new byte[16];
            try
            {
                byte[] buffer = Convert.FromBase64String(cipherStr);
                using Aes aes = Aes.Create();
                aes.Key = Encoding.UTF8.GetBytes(_key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using MemoryStream memoryStream = new(buffer);
                using CryptoStream cryptoStream = new((Stream)memoryStream, decryptor, CryptoStreamMode.Read);
                using StreamReader streamReader = new((Stream)cryptoStream);
                return streamReader.ReadToEnd();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return cipherStr;
            }
        }

        public static string DecryptNumber(string cipherNumStr)
        {
            cipherNumStr = cipherNumStr.Replace(" ", "+");
            byte[] cipherBytes = Convert.FromBase64String(cipherNumStr);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new(_key, new byte[] {
                0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
            });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using MemoryStream ms = new();
                using (CryptoStream cs = new(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(cipherBytes, 0, cipherBytes.Length);
                    cs.Close();
                }
                cipherNumStr = Encoding.Unicode.GetString(ms.ToArray());
            }
            return cipherNumStr;
        }
    }
}
